import styled from "@emotion/styled";
import React, { useState, useRef, useCallback } from "react";

const FormFileUpload = styled.form`
  height: 16rem;
  width: 28rem;
  max-width: 100%;
  text-align: center;
  position: relative;
`;

const InputFileUpload = styled.input`
  display: none;
`;

const LabelFileUpload = styled.label`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 1rem;
  border-style: dashed;
  border-color: #cbd5e1;
  background-color: #f8fafc;

  &.drag-active {
    background-color: #ffffff;
  }
`;

const UploadButton = styled.button`
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  border: none;
  font-family: "Oswald", sans-serif;
  background-color: transparent;

  &:hover {
    text-decoration-line: underline;
  }
`;

const DragFileElement = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const FileUploader = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(files: FileList) {
    encodeFileToBase64(files[0]);
    console.log("Number of files: ", JSON.stringify(files));
  }

  const encodeFileToBase64 = useCallback(
    async (fileBlob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob);
      reader.onload = () => {
        const src = reader.result as string;
        setImageSrc(src);
      };
      console.log(imageSrc);
    },
    [imageSrc]
  );

  // handle drag events
  const handleDrag = function (
    event: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!inputRef.current) return;
      event.stopPropagation();
      inputRef.current.click();
    },
    []
  );
  return (
    <FormFileUpload
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <InputFileUpload
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <LabelFileUpload
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div>
          <p>이미지를 드래그하거나</p>
          <UploadButton className="upload-button" onClick={onButtonClick}>
            업로드해주세요
          </UploadButton>
        </div>
      </LabelFileUpload>
      {dragActive && (
        <DragFileElement
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></DragFileElement>
      )}
      <div>
        <img src={imageSrc} alt={imageSrc} />
      </div>
    </FormFileUpload>
  );
};

export default FileUploader;
