const Entry = ({ entry, deleteEntry }) => {
    return (
      <p>
        {entry.name} {entry.number} <button onClick={deleteEntry}>delete</button>
      </p>
    )
  }

const Persons = ( { entries, deleteEntry }) => {
    return (
      entries.map(entry =>
        <Entry key={entry.id} entry={entry} deleteEntry={() => deleteEntry(entry.id)} />
      )
    )
}

export default Persons