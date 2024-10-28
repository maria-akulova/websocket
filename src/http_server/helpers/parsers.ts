export const incomingParser = (mess: Buffer): unknown => {
  const out = JSON.parse(mess.toString());
  try {
    const data = JSON.parse(out.data);
    return { ...out, data };
  } catch  {
    return { ...out };
  }
};

export const outgoingParser = (mess: Record<string, unknown>): string => {
  return JSON.stringify(mess);
};
