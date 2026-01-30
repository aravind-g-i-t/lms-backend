import bcrypt from 'bcrypt';


export const hashPassword=async (password: string): Promise<string> =>{
    return bcrypt.hash(password, 10);
}

export const comparePassword=async (plain: string, hashed: string): Promise<boolean>=> {
    return bcrypt.compare(plain, hashed);
}

export const getLastNMonthsRange = (months: number) => {
  const endDate = new Date(); // now

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
};
