export function convertToBanglaDigits(num: string, lang : string): string {
    let digits: string[];
    if(lang=='bn'){
       digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    }
    else{
       digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    }

    return num.toString().split('').map(d => digits[+d]).join('');
   
}

export function formatDate(dateStr: string,language:string): string {
    const [month, day, year] = dateStr.split(' ')[0].split('/');
    const date = new Date(+year, +month - 1, +day);
  
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    const locale = language === 'bn' ? 'bn-BD' : 'en-GB';
    return date.toLocaleDateString(locale, options);
   
}


export function isExistSpecialCharacter(strVal: string): boolean {
    const specialCharacters = [">", "<", "$", "<script>", "~", "--", "/*", "||", ";"];
    return specialCharacters.some(char => strVal.includes(char));
}