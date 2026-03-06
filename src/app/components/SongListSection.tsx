import { Music, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export function SongListSection() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 번역 파일에서 현재 언어의 리스트를 가져옵니다.
  const songsList = t('songs.list') || [];

  const filteredSongs = songsList.filter((song: any) => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedSongs = isOpen ? filteredSongs : filteredSongs.slice(0, 5);

  return (
    <section id="songs" className="py-24 bg-transparent relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-[#44a9ff] font-bold uppercase tracking-widest text-[16px]">
            {t('songs.subtitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
            {t('songs.title')}
          </h2>
          <p className="text-[#7D7D7D] mt-4 whitespace-pre-line tracking-[-0.03em] md:text-[22px] font-semibold">
            {t('songs.desc1')}
            <span className="text-[#44a9ff] font-bold">{t('songs.descBold')}</span>
            {t('songs.desc2')}
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-2xl overflow-hidden shadow-lg">
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200/60 bg-sky-50/50 bg-[#F0F9FF]">
             <div className="relative w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 placeholder={t('songs.searchPlaceholder')} 
                 className="w-full bg-white/80 border border-sky-200/60 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 transition-colors"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
          </div>

          {/* List Content */}
          <div className="divide-y divide-gray-200/60">
            {displayedSongs.length > 0 ? (
              displayedSongs.map((song: any) => (
                <div 
                  key={song.no}
                  className="break-keep flex items-center p-5 hover:bg-sky-50/60 transition-colors group"
                >
                  <div className="w-16 text-center font-mono text-xl text-gray-300 font-bold group-hover:text-sky-500 transition-colors">
                    {String(song.no).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-bold mb-1 text-[16px] md:text-[20px]">{song.title}</h4>
                    <p className="text-gray-500 text-sm">{song.artist}</p>
                  </div>
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-sky-100/80 p-2 rounded-full">
                       <Music className="w-5 h-5 text-sky-500" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                {t('songs.noResult')}
              </div>
            )}
          </div>
          
          {/* Expand Button */}
          {filteredSongs.length > 5 && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-sky-50/70 hover:bg-sky-100/80 text-gray-600 font-bold py-4 flex items-center justify-center gap-2 transition-colors border-t border-gray-200/60"
            >
              {isOpen 
                ? t('songs.collapse') 
                : `${t('songs.showAll')} (${filteredSongs.length})`}
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}