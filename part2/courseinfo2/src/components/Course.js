const Total = ({ parts }) => {
    let initialValue = 0
    const total = parts.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.exercises
    }, initialValue)
    return (
      <p><b>total of {total} exercises</b></p>
    )
}
  
const Part = ({ part }) => {
    return (
        <p>
        {part.name} {part.exercises}
        </p>
    )
}
  
const Course = ({ course }) => {
    return (
        <div>
            <h1>{course.name}</h1>
            {course.parts.map(part =>
            <Part key={part.id} part={part} />
            )}
            <Total parts={course.parts} />
        </div>
    )
}

export default Course