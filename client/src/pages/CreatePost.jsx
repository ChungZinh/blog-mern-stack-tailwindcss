import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export default function CreatePost() {
  const [value, setValue] = useState("");
  return (
    <div className="p-3 lg:max-w-6xl md:max-w-3xl  mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a new post
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="Reactjs">React.js</option>
            <option value="Nodejs">Node.js</option>
            <option value="expressjs">Express.js</option>
            <option value="mongodb">MongoDB</option>
            <option value="python">Python</option>
            <option value="django">Django</option>
            <option value="flask">Flask</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-neutral-400 border-dotted p-3">
          <FileInput type="file" id="image" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size={"sm"}
            outline
          >
            Upload image
          </Button>
        </div>
        <ReactQuill
          value={value}
          onChange={setValue}
          placeholder="Write something amazing..."
          className="h-96 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" size={"lg"}>
          Publish
        </Button>
      </form>
    </div>
  );
}
