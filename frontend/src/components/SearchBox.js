import React, { useState } from "react";
import { Form, Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };
  console.log(keyword);
  return (
    <Form
      onSubmit={submitHandler}
      style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gridGap: 5 }}
    >
      <FormControl
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Product..."
        className="mr-sm-2 ml-sm-5"
      ></FormControl>
      <Button type="submit" variant="outline-success" className="p-2">
        {" "}
        SEARCH
      </Button>
    </Form>
  );
};

export default SearchBox;
