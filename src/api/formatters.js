const pythonDateToStr = (python_date) => {
    // Преобразование даты из python вида '2014-12-31'
    // В русскую строку даты вида '31.12.2014'
    if (python_date) {
        let date = new Date(python_date);
        let formatter = new Intl.DateTimeFormat('ru');
        return formatter.format(date);
    }
    return '';
};

const dateToPythonStr = (jdate) => {
    // Преобразование javascript даты
    // В строку python вида '2014-12-31'
    if (!jdate) return null;
    let y = jdate.getFullYear();
    let m = jdate.getMonth() + 1;
    let d = jdate.getDate();
    return [
        y,
        m.toString().padStart(2, '0'),
        d.toString().padStart(2, '0'),
    ].join('-');
};

const datetimeToPythonStr = (jdate) => {
    // Преобразование javascript даты
    // В строку python вида '2014-12-31'
    if (!jdate) return null;
    const y = jdate.getFullYear();
    const m = jdate.getMonth() + 1;
    const d = jdate.getDate();
    const minute = jdate.getMinutes();
    const hour = jdate.getHours();
    return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:000`;
};

const dateToStr = (jdate) => {
    // Преобразование javascript даты в строку вида '31.12.2014'
    if (!jdate) return null;
    let y = jdate.getFullYear();
    let m = jdate.getMonth() + 1;
    let d = jdate.getDate();
    return [
        d.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        y,
    ].join('.');
};

const toJson = (str) => {
    // Преобразование из JSON с тестированием
    var a;
    try {
        a = JSON.parse(str);
    } catch (e) {
        a = str;
    }
    return a;
}

const rounder = (number, prec = 2) => {
    return +number.toFixed(prec);
}

export { pythonDateToStr, dateToPythonStr, datetimeToPythonStr, dateToStr, toJson, rounder };
