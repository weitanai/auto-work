import { ActionPanel, Detail, Action } from '@raycast/api';
import { useEffect, useState } from 'react';
import { ImproveWrite } from './type';
import { useQueryText } from './hooks/useQueryText';
import { SUMMARY_MODEL } from './hooks/useModel';
import {getSelectText} from './utils';

export default function Summary(props: { improveWrite?: ImproveWrite }) {
  const [selectedText, setSelectedText] = useState<string>('');
  const chats = useQueryText<any>(props.improveWrite ? props.improveWrite.chats : {});
  const { isLoading, data } = chats;
  const [markdown, setMarkdown] = useState<string>('');
  useEffect(() => {
    const setSelectText = function () {
      getSelectText()
        .then((selectedText) => {
          if (selectedText) {
            setSelectedText(selectedText.trim());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setSelectText();
  }, []);

  useEffect(() => {
    const querySelectedText = async () => {
      if (selectedText) {
        await chats.ask(selectedText, SUMMARY_MODEL, 'improve');
      }
    };
    querySelectedText();
  }, [selectedText]);

  useEffect(() => {
    if (data && data.answer) {
      const markdown = `
### Your Text

${selectedText}


### Rephrase Text

${data.answer}
`;
      setMarkdown(markdown);
    }
  }, [data]);

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content={data.answer} />
        </ActionPanel>
      }
    />
  );
}
