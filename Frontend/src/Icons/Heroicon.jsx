// HeroIcons.jsx
import Icons from "./Icons";
import {
  CalendarCheck,
  FileText,
  Megaphone,
  Library,
  MessageCircle,
  AlertTriangle,
  NotebookPen,
} from "lucide-react";

const iconList = [
  { icon: CalendarCheck, label: "Timetable" },
  { icon: FileText, label: "Assignments" },
  { icon: Megaphone, label: "Notice Board" },
  { icon: Library, label: "Library" },
  { icon: AlertTriangle, label: "Complaint Desk" },
  { icon: MessageCircle, label: "Chat" },
   { icon: NotebookPen, label: "Attendence" },
];

const HeroIcons = () => {
  return (
    <div className="relative mx-auto w-[750px] overflow-hidden py-6 fade-mask">

      {/* MARQUEE */}
      <div className="whitespace-nowrap flex relative z-20">
        <div className="flex gap-10 animate-marquee">
          {iconList.map((item, i) => (
            <Icons key={i} icon={item.icon} label={item.label} />
          ))}

          {/* Duplicate for seamless infinite scrolling */}
          {iconList.map((item, i) => (
            <Icons key={"dup-" + i} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroIcons;
