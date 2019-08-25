class Util {
    /**
     * @summary Return a formatted currency string from an integer
     */
    static parseCurrency(int) {
        let val = int / 100;
        return "$" + val.toFixed(2);
    }
}

export default Util;