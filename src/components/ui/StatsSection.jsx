export default function StatsSection({ data = [] }) {
  if (!data || !Array.isArray(data)) return null;

  return (
    <section className="bg-white py-10 mb-2">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 text-center mt-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center border-r last:border-r-0 border-neut-400 h-30"
          >
            <h3 className="text-3xl font-bold text-primary leading-tight">
              {item.value}+
            </h3>
            <p className="text-sm sm:text-base text-black max-w-[140px] h-[30px]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
