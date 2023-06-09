import { ActionPanel, Detail, Action } from '@raycast/api';
import { useEffect, useState } from 'react';
import { Query, Chat } from './type';
import { useQueryText } from './hooks/useQueryText';
import { SUMMARY_MODEL } from './hooks/useModel';
import { getSelectText } from './utils';

export default function Summary(props: { summary?: Query }) {
  const [selectedText, setSelectedText] = useState<string>('');
  const chats = useQueryText<Chat>(props.summary ? props.summary.chats : ({} as Chat));
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
        await chats.ask(selectedText, SUMMARY_MODEL, 'summarize');
      }
    };
    querySelectedText();
  }, [selectedText]);

  useEffect(() => {
    if (data && data.answer) {
      const markdown = `
### Your Text
${selectedText}

### Summary Text
${data.answer}
`;
      setMarkdown(markdown);
    }
  }, [data]);

  return selectedText ? (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content={data.answer} />
        </ActionPanel>
      }
    />
  ) : (
    <Detail markdown="You can select or copy text to summary" />
  );
}
