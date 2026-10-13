import NewTrade from "../components/NewTrade";

const AddTrade = () => {
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-2xl text-mauve-600">Add Trade</h2>
      <div className="mx-auto max-w-xl">
        <NewTrade />
      </div>
    </div>
  );
}
export default AddTrade