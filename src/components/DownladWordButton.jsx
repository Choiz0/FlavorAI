import React from "react";

const DownladWordButton = () => {
  const handleDownload = async () => {
    const htmlContent = document.getElementById(
      "content-to-download"
    ).outerHTML;

    const blob = await parseHtml(htmlContent, {
      orientation: "portrait",
      withFooter: true,
      footer: '<p style="text-align: center;">Footer Content</p>',
    });

    // Using FileSaver to save the file
    saveAs(blob, "downloaded-file.docx");
  };

  return <button onClick={handleDownload}>Download as Word</button>;
};

export default DownladWordButton;
