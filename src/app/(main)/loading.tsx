export default function Loading() {
  return (
    <div className='flex flex-col gap-16 md:gap-20 xl:gap-24 py-6 md:py-8 pb-32 md:pb-40 animate-pulse'>
      {/* Skeleton Hero */}
      <section className='relative w-full min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] bg-slate-200 dark:bg-slate-800/50 rounded-[2.5rem] md:rounded-[3.5rem] xl:rounded-[4.5rem] shadow-sm py-16 lg:py-0'>
        <div className='absolute inset-0 flex flex-col items-center justify-center w-full max-w-[90%] md:max-w-5xl px-4 mx-auto'>
          <div className='h-12 md:h-16 lg:h-20 w-3/4 max-w-2xl bg-white/40 dark:bg-white/10 rounded-2xl mb-6' />
          <div className='h-4 md:h-6 w-5/6 max-w-xl bg-white/40 dark:bg-white/10 rounded-lg mb-12' />
          <div className='h-16 sm:h-20 lg:h-[88px] w-full max-w-4xl bg-white/40 dark:bg-white/10 rounded-[1.5rem] lg:rounded-full mt-4' />
        </div>
      </section>

      {/* Skeleton Stats */}
      <section className='relative z-30 -mt-20 sm:-mt-24 lg:-mt-32 xl:-mt-40 px-4 sm:px-6 md:px-10'>
        <div className='max-w-6xl mx-auto bg-white/80 dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] xl:rounded-[4rem] shadow-sm p-6 sm:p-8 md:p-10 xl:p-12 border border-gray-100 flex flex-wrap lg:flex-nowrap justify-between gap-6'>
           <div className='h-20 w-full lg:w-1/4 bg-slate-100 dark:bg-slate-800 rounded-3xl' />
           <div className='h-20 w-full lg:w-1/4 bg-slate-100 dark:bg-slate-800 rounded-3xl' />
           <div className='h-20 w-full lg:w-1/4 bg-slate-100 dark:bg-slate-800 rounded-3xl' />
           <div className='h-20 w-full lg:w-1/4 bg-slate-100 dark:bg-slate-800 rounded-3xl hidden lg:block' />
        </div>
      </section>
      
      {/* Skeleton Destinations */}
      <section className='px-2 md:px-6'>
        <div className='mb-8 lg:mb-12'>
          <div className='h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-3' />
          <div className='h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-md max-w-full' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
          {[...Array(4)].map((_, i) => (
             <div key={i} className='h-[380px] sm:h-[420px] lg:h-[450px] xl:h-[500px] w-full bg-slate-200 dark:bg-slate-800 rounded-[2rem] lg:rounded-[3rem]' />
          ))}
        </div>
      </section>
    </div>
  );
}
