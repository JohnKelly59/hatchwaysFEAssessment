import React, { useEffect, useState } from "react";
import "./App.css";
import { Collapse } from "react-collapse";
import { FormControl } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

var average = (a) => eval(a.join("+")) / a.length;

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stud, setStud] = useState([]);
  const [tags, setTags] = useState([]);
  const [state, setState] = useState({});
  const { open } = state;

  const [value, setValue] = useState({
    sName: "",
    tag: "",
    tagEdit: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setValue((prevValue) => {
      if (name === "sName") {
        return {
          ...prevValue,
          [name]: value,
        };
      } else if (name === "tagEdit") {
        return {
          ...prevValue,
          [name]: value,
        };
      } else {
        return {
          ...prevValue,
          [name]: value,
        };
      }
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTags((prevValue) => {
        return [...prevValue, event.target.value];
      });
    }
  };

  const handleOpen = (open) => {
    setState((prevState) => ({
      ...prevState,
      open,
    }));
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setStud(result.students);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <FormControl
          className="input"
          placeholder="Search by name"
          type="text"
          name="sName"
          value={value.sName}
          onChange={handleChange}
        />
        <FormControl
          placeholder="Search by tag"
          className="input"
          type="text"
          name="tag"
          value={value.tag}
          onChange={handleChange}
        />

        {stud
          .filter((item) => {
            if (!value) return true;
            if (
              item.firstName
                .toUpperCase()
                .includes(value.sName.toUpperCase()) ||
              item.lastName.toUpperCase().includes(value.sName.toUpperCase())
            ) {
              return true;
            }
            return false;
          })
          .map((student) => (
            <div key={student.id}>
              <div className="pic">
                <img src={student.pic} />
              </div>
              <div className="info">
                <h1>
                  {student.firstName.toUpperCase()}{" "}
                  {student.lastName.toUpperCase()}
                </h1>
                <div className="btn">
                  {open ? (
                    <RemoveIcon
                      style={{ fill: "grey" }}
                      className="icon"
                      onClick={() => handleOpen(student.id)}
                      alue={student.id}
                    />
                  ) : (
                    <AddIcon
                      style={{ fill: "grey" }}
                      className="icon"
                      onClick={() => handleOpen(student.id)}
                      value={student.id}
                    />
                  )}
                </div>
                <p>Email: {student.email}</p>
                <p>Company: {student.company}</p>
                <p>Skill: {student.skill}</p>

                <p>
                  Average:
                  {average(student.grades)}
                </p>

                <Collapse isOpened={open === student.id}>
                  <div id="example-collapse-text">
                    {student.grades.map((grade, i) => (
                      <p key={i}>
                        Test {i}: {grade}%
                      </p>
                    ))}
                  </div>
                </Collapse>
                <div>
                  {tags
                    .filter((item) => {
                      if (!tags) return true;
                      if (
                        item.toUpperCase().includes(value.tag.toUpperCase())
                      ) {
                        return true;
                      }
                      return false;
                    })
                    .map((tag, index) => (
                      <p key={index}>{tag}</p>
                    ))}
                </div>
                <FormControl
                  className="input"
                  placeholder="Add a tag"
                  type="text"
                  name="tagEdit"
                  value={value.tagEdit}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <hr />
            </div>
          ))}
      </div>
    );
  }
}
export default App;
