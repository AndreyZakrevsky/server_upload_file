
// app.use( bodyParser.json() );
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(cors());


class CSVFileReader {
    constructor(file) {
        this.file = file;
    }

    readFile() {
        const reader = new FileReader();
        reader.onload = function () {
            // gets processed data
            const processed = this.processData(reader.result);
            console.log(processed)
            // // sends event after data already have processed
            // const fileInput = document.getElementById('fld_file');
            // const event = new CustomEvent('dataready', { 'detail': processed });
            // fileInput.dispatchEvent(event);
        };
        // fixes <file type isn't 'Blob'> runtime error
        const blob = this.file.slice(0, this.file.size);
        // starts reading the file. When reading is done, calls the onload event defined above
        reader.readAsText(blob, 'utf8');
    }

    processData(allText) {
        const allLines = allText.split(/\r\n|\n/);
        const headers = allLines[0].split(', ');
        const lines = [];
      
        for (let i = 1; i < allLines.length; i++) {
            const data = allLines[i].split(', ');
            if (data.length === headers.length) {
                let tStr = '';
                for (let j = 0; j < headers.length; j++) {
                  const filler = (j === headers.length - 1) ? '' : ',';
                  tStr += `"${headers[j]}": "${data[j]}"${filler}`;
                }
                lines.push(JSON.parse(`{${tStr}}`));
            }
        }
        return lines;
      }
}

module.exports = {
    CSVFileReader
};






