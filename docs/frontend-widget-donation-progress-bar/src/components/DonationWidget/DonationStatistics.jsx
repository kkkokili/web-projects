export default function DonationStatistics({ data, error }) {
  return (
    <div className='donation-text text-left mt-3.5'>
      {error.error ? (
        // ❌ 有错误 → 显示错误信息
        <p className='text-red-500 font-bold'>Error: {error.message}</p>
      ) : (
        // ✅ 无错误 → 显示原本的 donation 信息
        <>
          <p className='text-3xl font-bold bg-red-500 text-white p-4'>
            {data.currency} {data.raised.toLocaleString()}
          </p>
          <p className='mb-5 text-xs mt-2'>
            raised of {data.currency}
            {data.goal.toLocaleString()} goal
          </p>
          <p className='font-bold'>{data.donors}</p>
          <p className='font-sm'>Donations</p>
        </>
      )}
    </div>
  );
}
