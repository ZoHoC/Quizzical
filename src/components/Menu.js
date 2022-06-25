import React from "react";
import bigBlobLemon from "../images/bigBlobLemon.png";
import bigBlobBlue from "../images/bigBlobBlue.png";

export default function Menu(props) {
  const categoryArray = [
    { id: -1, name: "Choose" },
    { id: 0, name: "Any category" },
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
    { id: 11, name: "Entertainment: Film" },
    { id: 12, name: "Entertainment: Music" },
    { id: 13, name: "Entertainment: Musicals & Theatres" },
    { id: 14, name: "Entertainment: Television" },
    { id: 15, name: "Entertainment: Video Games" },
    { id: 16, name: "Entertainment: Board Games" },
    { id: 17, name: "Science & Nature" },
    { id: 18, name: "Science: Computers" },
    { id: 19, name: "Science: Mathematics" },
    { id: 20, name: "Mythology" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Politics" },
    { id: 25, name: "Art" },
    { id: 26, name: "Celebrities" },
    { id: 27, name: "Animals" },
    { id: 28, name: "Vehicles" },
    { id: 29, name: "Entertainment: Comics" },
    { id: 30, name: "Science: Gadgets" },
    { id: 31, name: "Entertainment: Japanese Anime & Manga" },
    { id: 32, name: "Entertainment: Cartoon & Animations" },
  ];

  const difficultyArray = ["Choose", "Any difficulty", "Easy", "Medium", "Hard"];

  // Changes formData values to input values
  function handleChange(event) {
    const { name, value } = event.target;
    props.setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  return (
    <div className="app">
      <h1 className="quiz--title">Quizzical</h1>
      <p className="quiz--info">Find out how much you know!</p>
      {/* Runs wrapperFucntion which initiates a game */}
      <button className="quiz--btn quiz--btn__start" onClick={props.handleClick}>
        Start quiz
      </button>
      <form className="quiz--form">
        {/* name is = to formdData.[name] in order for handleChange function to change data in formData */}
        <select className="quiz--form__select" name="categoryId" onChange={handleChange}>
          {/* Mapping over categoryArray instead of typing each option by hand */}
          {categoryArray.map((category, index) => {
            return (
              <option value={category.id} key={index}>
                {category.name}
              </option>
            );
          })}
        </select>
        <select className="quiz--form__select" name="difficulty" onChange={handleChange}>
          {difficultyArray.map((difficulty, index) => {
            return (
              <option value={difficulty} key={index}>
                {difficulty}
              </option>
            );
          })}
        </select>
        <input className="quiz--form__input" name="number" type="number" onChange={handleChange} min="1" max="20" value={props.formData.number} />
      </form>
      <img src={bigBlobLemon} className="img--Lemon" alt="yellowBlob" />
      <img src={bigBlobBlue} className="img--Blue" alt="blueBlob" />
    </div>
  );
}
