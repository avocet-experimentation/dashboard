function TableRow({ datum }: { datum: object }) {
  return (
    <tr>
      {Object.values(datum).map((value, i) => <td key={i}>{JSON.stringify(value)}</td>)}
    </tr>
  );
}

export default function Table({ data }: { data: object[]}) {
  
    const headers = data?.reduce((output: string[], entry) => {
    const result = output;
    Object.keys(entry).forEach((key) => {
      if (!result.includes(key)) result.push(key);
    });
    return result;
  }, []) ?? [];

  
  return (
    <table className='table'>
      <thead>
        <tr>
          {headers.map((header, i) => <td key={i}>{header}</td>)}
        </tr>
      </thead>
      <tbody>
        {data && data.map((datum, i) => <TableRow key={i} datum={datum}></TableRow>)}
      </tbody>
    </table>
  );
}
