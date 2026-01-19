export const Errors = ({ errors }) => {
  if (!errors) return null;

  const errorList = Array.isArray(errors) ? errors : [errors];

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <ul className="list-disc list-inside">
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default Errors;
