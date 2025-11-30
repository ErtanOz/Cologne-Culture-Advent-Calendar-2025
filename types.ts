export interface CalendarDay {
  day: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface EditModalTranslations {
  editDay: string;
  titleLabel: string;
  titlePlaceholder: string;
  titleHelp: string;
  imageLabel: string;
  imagePlaceholder: string;
  imageHelp: string;
  linkLabel: string;
  linkPlaceholder: string;
  linkHelp: string;
  preview: string;
  clear: string;
  cancel: string;
  save: string;
}

export interface DayWindowProps {
  dayData: CalendarDay;
  isEditMode: boolean;
  onEdit: (day: CalendarDay) => void;
  editLabel: string;
}

export interface EditModalProps {
  dayData: CalendarDay | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: number, imageUrl: string, linkUrl: string, title: string) => void;
  t: EditModalTranslations;
}
