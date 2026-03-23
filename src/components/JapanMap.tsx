import { regions } from "../data/regions";

interface JapanMapProps {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
}

export default function JapanMap({ onRegionClick, selectedRegion }: JapanMapProps) {
  return (
    <svg viewBox="0 0 500 700" className="w-full max-w-md mx-auto">
      {/* Hokkaido */}
      <g onClick={() => onRegionClick("hokkaido")} className="cursor-pointer">
        <path
          d="M320,30 L370,25 L400,40 L410,70 L400,100 L380,120 L350,130 L320,120 L300,100 L290,70 L300,45 Z"
          fill={selectedRegion === "hokkaido" ? regions[0].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="350" y="80" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">北海道</text>
      </g>

      {/* Tohoku */}
      <g onClick={() => onRegionClick("tohoku")} className="cursor-pointer">
        <path
          d="M310,150 L350,140 L370,160 L375,200 L365,240 L340,260 L310,265 L290,250 L280,220 L285,180 Z"
          fill={selectedRegion === "tohoku" ? regions[1].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="330" y="205" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">東北</text>
      </g>

      {/* Kanto */}
      <g onClick={() => onRegionClick("kanto")} className="cursor-pointer">
        <path
          d="M295,270 L340,268 L360,280 L365,310 L350,335 L320,345 L290,335 L275,310 L280,285 Z"
          fill={selectedRegion === "kanto" ? regions[2].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="320" y="310" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">關東</text>
      </g>

      {/* Chubu */}
      <g onClick={() => onRegionClick("chubu")} className="cursor-pointer">
        <path
          d="M230,265 L290,268 L295,285 L290,335 L270,360 L240,370 L210,355 L195,330 L200,295 Z"
          fill={selectedRegion === "chubu" ? regions[3].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="245" y="320" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">中部</text>
      </g>

      {/* Kinki */}
      <g onClick={() => onRegionClick("kinki")} className="cursor-pointer">
        <path
          d="M195,340 L240,375 L245,410 L230,435 L200,440 L175,425 L165,395 L170,365 Z"
          fill={selectedRegion === "kinki" ? regions[4].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="205" y="400" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">近畿</text>
      </g>

      {/* Chugoku */}
      <g onClick={() => onRegionClick("chugoku")} className="cursor-pointer">
        <path
          d="M100,370 L165,365 L170,395 L165,430 L140,445 L110,440 L85,420 L80,395 Z"
          fill={selectedRegion === "chugoku" ? regions[5].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="125" y="410" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">中國</text>
      </g>

      {/* Shikoku */}
      <g onClick={() => onRegionClick("shikoku")} className="cursor-pointer">
        <path
          d="M110,450 L160,448 L185,460 L190,485 L170,500 L135,505 L110,490 L100,470 Z"
          fill={selectedRegion === "shikoku" ? regions[6].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="148" y="478" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">四國</text>
      </g>

      {/* Kyushu & Okinawa */}
      <g onClick={() => onRegionClick("kyushu")} className="cursor-pointer">
        <path
          d="M55,440 L95,435 L100,465 L95,510 L80,535 L55,540 L35,520 L30,490 L35,460 Z"
          fill={selectedRegion === "kyushu" ? regions[7].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="65" y="490" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">九州</text>
        {/* Okinawa */}
        <path
          d="M40,600 L65,595 L75,610 L70,630 L50,640 L35,630 L30,615 Z"
          fill={selectedRegion === "kyushu" ? regions[7].color : "#E5E7EB"}
          stroke="#fff"
          strokeWidth="2"
          className="transition-colors duration-200 hover:opacity-80"
        />
        <text x="52" y="620" textAnchor="middle" className="text-xs fill-gray-700 pointer-events-none font-bold">沖繩</text>
        {/* Dashed line connecting Okinawa */}
        <line x1="55" y1="545" x2="52" y2="595" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4,4" />
      </g>
    </svg>
  );
}
