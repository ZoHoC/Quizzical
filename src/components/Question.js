export default function Question(props) {
  // Creating anwser elements and adding additional class(es) based on interaction
  const anwsersEl = props.answers.map(anwser => {
    const classNames = {
      pressed: anwser.isPressed ? "question--card__answer--pressed" : "",
      correct: anwser.isCorrect && props.isChecked ? "question--card__answer--correct" : "",
      wrong: anwser.isWrong && props.isChecked && anwser.isPressed ? "question--card__answer--false" : "",
      faint: props.isChecked ? "question--card__answer--faint" : "",
    };
    return (
      <li
        key={anwser.id}
        onClick={() => toggle(anwser.id)}
        className={`question--card__answer 
                    ${classNames.pressed}
                    ${classNames.correct}
                    ${classNames.wrong}
                    ${classNames.faint}`}
      >
        {decodeURIComponent(anwser.text)}
      </li>
    );
  });

  // When anwser is clicked it runs a toggle function with anwser id as parametar. If state isChecked is false it runs toggleChoice function and give it parameters of question Id and anwser Id.
  function toggle(id) {
    if (!props.isChecked) {
      props.toggleChoice(props.id, id);
    }
    // if isChecked is true it locks user from clicking on interacting with anwsers
  }

  return (
    <div className="question--card">
      <h2 className="question--card__title">{decodeURIComponent(props.question)}</h2>
      <ol className="question--card__list"> {anwsersEl}</ol>
    </div>
  );
}
