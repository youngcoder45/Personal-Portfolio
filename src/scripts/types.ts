export type Row = {
  text: string;
  cls?: string;
  href?: string;
  title?: string;
};

export type CmdOut = (Row | string)[];