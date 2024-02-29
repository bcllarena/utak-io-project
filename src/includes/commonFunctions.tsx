function capitalizePhrase(phrase: string): string {
  let words = phrase.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

function underConstruction(page: string) {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">
          {page} page under construction
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We are working hard to bring you the best experience possible. Please
          check back soon.
        </p>
        <img
          className="mt-8"
          src={require("../assets/images/under-construction.png")}
          alt="Under construction"
        />
      </div>
    </>
  );
}

export { capitalizePhrase, underConstruction };
