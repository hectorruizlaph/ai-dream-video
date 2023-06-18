const Step1Options = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl mb-6 text-gray-700">Choose Your Option</h1>
      <div className="flex gap-6">
        <button
          className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition"
          //   onClick={/* function to upload an image */}
        >
          Upload Image
        </button>
        <button
          className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition"
          //   onClick={/* function to create an image */}
        >
          Create Image
        </button>
      </div>
    </div>
  )
}

export default Step1Options
