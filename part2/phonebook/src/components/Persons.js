const Entry = ({ entry }) => {
    return (
      <p>{entry.name} {entry.number}</p>
    )
  }

const Persons = ( { entries }) => {
    return (
    entries.map(entry =>
        <Entry key={entry.id} entry={entry} />
    )
    )
}

export default Persons