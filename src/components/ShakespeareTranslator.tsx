import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface ShakespeareTranslatorProps {
  text: string;
  onTranslated?: (translated: string) => void;
}

function ShakespeareTranslator({
  text,
  onTranslated,
}: ShakespeareTranslatorProps) {
  const [translatedText, setTranslatedText] = useState("");

  const mutation = useMutation({
    mutationFn: async (textToTranslate: string) => {
      const response = await fetch(
        "https://api.funtranslations.com/translate/shakespeare.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `text=${encodeURIComponent(textToTranslate)}`,
        }
      );

      if (!response.ok) throw new Error("Translation failed");
      return response.json();
    },
    onSuccess: (data) => {
      const translated = data.contents.translated;
      setTranslatedText(translated);
      onTranslated?.(translated);
    },
  });

  // Automatically translate when text prop changes
  useEffect(() => {
    if (text.trim()) {
      mutation.mutate(text);
    }
  }, [text]);

  return (
    <>
      {mutation.isPending && <p>Translating...</p>}
      {mutation.isError && (
        <div>
          <p>Error: {mutation.error.message}</p>
          <p>{text}</p>
        </div>
      )}
      {translatedText && <p>{translatedText}</p>}
    </>
  );
}

export default ShakespeareTranslator;
