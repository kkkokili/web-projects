export default function ProgressBar({ data, error, ref }) {
  return (
    <div className='flex items-center gap-2'>
      {" "}
      <progress
        className={
          error.error
            ? "progress progress-error w-full h-4"
            : "progress progress-warning w-full h-4 shiny-once transition-all duration-1700"
        }
        ref={ref}
        value={data.raised}
        max={data.goal}
      ></progress>
      {!error.error && (
        <span className='donation-text text-xs'>
          {Math.min(100, Math.round((data.raised / data.goal) * 100))}%
        </span>
      )}
    </div>
  );
}
