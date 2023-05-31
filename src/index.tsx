import { ActionPanel, Action, List, getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";


async function getText() {
  try {
    const selectedText = await getSelectedText();

    // await Clipboard.paste(transformedText);
    return selectedText;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Cannot transform text",
      message: String(error),
    });
  }
}

export default function Command() {
  const [selectText, setSelectText] = useState<string>('');
 
  useEffect(() => {
    async function fetchText() {
      try {
        getText()
        .then((res: any) => {
          setSelectText(res);
        })
        .catch((err) => console.log(err));
      } catch (error) {
        setSelectText(
         'error'
        );
      }
    }

    fetchText();
  }, []);
    return (
      <List isLoading={selectText}>
        <List.Item title={selectText}>
        </List.Item>
      </List>
    );
  }

