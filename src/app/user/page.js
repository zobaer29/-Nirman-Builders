import Image from 'next/image';

export default function ClientDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Project Section: Timeline */}
      <section className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <span className="px-3 py-1 bg-[#78f5ae] text-[#005a35] rounded-full text-xs font-bold font-label tracking-wide mb-2 inline-block">
              ON TRACK
            </span>
            <h3 className="text-3xl font-headline font-extrabold tracking-tight">
              The Emerald Heights - Unit 402
            </h3>
            <p className="text-[#548064] font-body mt-1">
              Primary Residence | Construction Phase 3
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest">
              Handover Date
            </p>
            <p className="text-2xl font-headline font-bold text-[#006a28]">
              Dec 24, 2026
            </p>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="relative pt-8 pb-4 px-2">
          <div className="absolute top-1/2 left-0 w-full h-[6px] bg-[#a8ecbf] rounded-full -translate-y-1/2 overflow-hidden">
            <div
              className="h-full bg-[#006a28] w-[65%] rounded-full shadow-[0_0_8px_rgba(0,106,40,0.4)]"
            ></div>
          </div>
          <div className="relative flex justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#006a28] text-[#cfffce] flex items-center justify-center relative z-10 shadow-lg">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
              </div>
              <p className="mt-4 text-[11px] font-bold font-headline text-center">FOUNDATION</p>
              <p className="text-[10px] text-[#89b898] font-medium">Completed</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#006a28] text-[#cfffce] flex items-center justify-center relative z-10 shadow-lg">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
              </div>
              <p className="mt-4 text-[11px] font-bold font-headline text-center">STRUCTURAL</p>
              <p className="text-[10px] text-[#89b898] font-medium">Completed</p>
            </div>
            {/* Step 3 (Active) */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#006a28] border-4 border-[#cfffce] text-[#cfffce] flex items-center justify-center relative z-10 shadow-xl -mt-1">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <p className="mt-3 text-[11px] font-bold font-headline text-center text-[#006a28]">PLUMBING & ELECTRICAL</p>
              <p className="text-[10px] text-[#005d22] font-bold">In Progress (65%)</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#a8ecbf] text-[#548064] flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-sm">format_paint</span>
              </div>
              <p className="mt-4 text-[11px] font-bold font-headline text-center text-[#548064]">INTERIOR FINISH</p>
              <p className="text-[10px] text-[#89b898] font-medium">Next Phase</p>
            </div>
            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#a8ecbf] text-[#548064] flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-sm">key</span>
              </div>
              <p className="mt-4 text-[11px] font-bold font-headline text-center text-[#548064]">HANDOVER</p>
              <p className="text-[10px] text-[#89b898] font-medium">Upcoming</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Site Logs & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#c7fdd8] rounded-xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline font-bold text-xl">Site Work Logs</h4>
              <button className="text-[#006a28] font-bold text-sm flex items-center gap-1 hover:underline">
                View Full History
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            {/* Photo Feed */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="group relative rounded-lg overflow-hidden aspect-square cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="construction site interior"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN8PpqCm66AhEXATLvo35DVb8IUlDuCt1LM_T3EldvwkyELfUXnkJ4Ie-LwTPCsr4prgJp3C4XFC2XWOVDSdmqtN9XsonJxLtQXm-jhz5npLwfRAiqbYeJE6ySTXmhEz6SVBLatCQDBeZbnlhQMPPN6kMXaftyOVnAvModWrDxtOOsFfBqwhVLZE_A0BdfLGkK8ZiuEt9grcQwfwiyKCjjtL2-6dEJy6iu94RPgcVC-ppUnGkGjET0EIjCpoVr9b44pG2kHr9mGDU"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06361f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold">Wiring Stage - Oct 12</p>
                </div>
              </div>
              <div className="group relative rounded-lg overflow-hidden aspect-square cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="modern skyscraper construction"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeMPzBtC1x6g-j7Hb3kLWKsL7F9Wiy55R5L3APknPxq9U4VhzrALuz5QcUo6clSh5tqMiddm8Fd9hqNE4fqWYkDW0ZM5cEwj3x3MBsa79gYXhMS6lguTBmZGBSiDeDHWgm30jM6SZGf-8p2sa5bazf6m6KXA87Nkc-2wryzqBWWHl4oE7L3JGSZDuYWRhkm0bXFjPOpKSjSQU0q1XNgQQTwhAMqS6NV0l7P9KwPbiWchOmFYsQt9AVd_488cbhoWGjG-O7cQNwH3o"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06361f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold">Beam Inspection - Oct 10</p>
                </div>
              </div>
              <div className="group relative rounded-lg overflow-hidden aspect-square cursor-pointer hidden md:block">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="detailed close-up of copper plumbing"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWbfCpydfRTuvnTVfC0v_YiM91w8kPcc4bTSBCjHFTlttv18Rg54X79sxqDPzaiOIXAhG1QaQDKAZbBGQHVkRyGbpSq6E6pHWBu9byroigg87230DFMfZNz7pTdn1tZR9tA9w_meCihg26EIAkFTFqkLYR43BH17n7iB2ycCyAZg0Xb5yK53VEumlrtkqbBzKNBZ2604StBb72KHVPQKi3CfInc92bDRjlO8UxYXsM1gZK1_rGV6EQKpCma6jc6rYlXzw5VAwli-Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06361f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-xs font-bold">Main Inflow - Oct 08</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="bg-white p-4 rounded-lg flex gap-4 items-start border border-[#548064]/5">
                <div className="bg-[#006a28]/10 p-2 rounded-lg text-[#006a28]">
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold font-headline">Material Delivery Received</h5>
                    <span className="text-[10px] font-medium text-[#548064]">2 hours ago</span>
                  </div>
                  <p className="text-xs text-[#39644a] mt-1 leading-relaxed">
                    High-grade ceramic tiles for Master Suite delivered and logged by Site Supervisor.
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg flex gap-4 items-start border border-[#548064]/5">
                <div className="bg-[#00693f]/10 p-2 rounded-lg text-[#00693f]">
                  <span className="material-symbols-outlined">task_alt</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold font-headline">Structural Slab Cast</h5>
                    <span className="text-[10px] font-medium text-[#548064]">Yesterday</span>
                  </div>
                  <p className="text-xs text-[#39644a] mt-1 leading-relaxed">
                    Curing process started for the 4th floor balcony slab. Next inspection scheduled for Monday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Chat */}
        <div className="space-y-8">
          {/* Document Center */}
          <div className="bg-[#a8ecbf]/30 rounded-xl p-6 border border-[#006a28]/10">
            <h4 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a28]">folder_open</span>
              Document Center
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#b02500]/10 text-[#b02500] flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-headline leading-none">Architectural Plan_V2</p>
                    <p className="text-[9px] text-[#548064] mt-1 uppercase">12.4 MB • PDF</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#dcffe5] text-[#006a28] transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-lg flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#b02500]/10 text-[#b02500] flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-headline leading-none">Structural Audit Report</p>
                    <p className="text-[9px] text-[#548064] mt-1 uppercase">4.8 MB • PDF</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#dcffe5] text-[#006a28] transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-lg flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#006a28]/10 text-[#006a28] flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">description</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-headline leading-none">Sept Payment Invoice</p>
                    <p className="text-[9px] text-[#548064] mt-1 uppercase">1.2 MB • DOCX</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#dcffe5] text-[#006a28] transition-colors">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>
            </div>
            <button className="w-full mt-6 py-2 rounded-lg border-2 border-[#006a28]/20 text-[#006a28] font-bold text-xs hover:bg-[#006a28]/5 transition-colors">
              Request New Report
            </button>
          </div>

          {/* Communication Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline font-bold text-lg">Project Chat</h4>
              <span className="w-2 h-2 bg-[#006a28] rounded-full animate-pulse"></span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              <div className="flex justify-end">
                <div className="bg-[#006a28] text-[#cfffce] p-3 rounded-xl rounded-tr-none max-w-[80%]">
                  <p className="text-xs">
                    Hi Rajiv, can we confirm the switch to granite for the kitchen island by tomorrow?
                  </p>
                  <p className="text-[9px] text-[#cfffce]/60 mt-1 text-right">09:42 AM</p>
                </div>
              </div>
              <div className="flex gap-2">
                <img
                  className="w-6 h-6 rounded-full self-end object-cover"
                  alt="Architect avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSj2BKtIZaWOoSknywzggAEJuo9UAKKLlQFBcdpJBKN1w0LinCKL9xotHXTMvxWFaEV1cCddhm_lAhhHZOOycETIeue-CzW8Zw1Dax81uR-UrhyZb8Ps7kAAV4uRGTIwxsP_aHb9STUp5wKXkQnWB3l4HMKAtto5y_n02uTwBwKN6zjQrbEvnvu5ma8BpctE6hkgpPZm0rYaN2yAhngcejR9_rlsLQLWR2DGZR5RMhWRSv4EzGLOfyUxalROtD7ONyIq03FWskwz8"
                />
                <div className="bg-[#bbf6ce] p-3 rounded-xl rounded-tl-none max-w-[80%]">
                  <p className="text-xs text-[#06361f]">
                    Absolutely. I've sent the updated material specs to the site lead. We need your sign-off on the color sample.
                  </p>
                  <p className="text-[9px] text-[#548064] mt-1">10:15 AM</p>
                </div>
              </div>
              <div className="flex gap-2">
                <img
                  className="w-6 h-6 rounded-full self-end object-cover"
                  alt="Contractor avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9n7ZBDtBSyMt869DnfTjucTzmhrw5dNgko_dYOhEZMzvhtfoIG5Eaiilmzl_VLiBnqwgX8I2mBTYXThGqBQbwo27HHGJei_H7kUiU-9sHrestBmbdjIZShyzTH9JoyO_L2iHnNsn5kou1c52UyRennl2f_7ifgP7sE7u6QH3wIj1f5SkJb2nnYbRz5HXakuA7dPQaNXix8NZGOHmKhrmyL8Ew5S6FAOTc3xlFkojDABZ_kKqs_u2Zgt_lWkky0g39ynJwjm226Xo"
                />
                <div className="bg-[#bbf6ce] p-3 rounded-xl rounded-tl-none max-w-[80%]">
                  <p className="text-[10px] font-bold text-[#006a28] mb-1">Contractor Team</p>
                  <p className="text-xs text-[#06361f]">
                    Sample board is ready at the site office. Please drop by whenever convenient.
                  </p>
                  <p className="text-[9px] text-[#548064] mt-1">10:30 AM</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                className="w-full bg-[#c7fdd8] outline-none border-none rounded-full pl-4 pr-12 py-3 text-xs focus:ring-2 focus:ring-[#006a28]"
                placeholder="Type a message..."
                type="text"
              />
              <button className="absolute right-1 top-1 w-9 h-9 bg-[#006a28] text-[#cfffce] rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-[#548064]/10 text-xs font-medium text-[#06361f]/50">
        <p>© 2024 Nirman Builders Pvt Ltd. All structural plans are copyrighted.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-[#006a28]" href="#">Privacy Protocol</a>
          <a className="hover:text-[#006a28]" href="#">Site Safety Standards</a>
          <a className="hover:text-[#006a28]" href="#">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
