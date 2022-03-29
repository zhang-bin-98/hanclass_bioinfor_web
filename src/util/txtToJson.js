import gnenTitle from '@/assets/geneTitle.json'

const transformer = (txt, dem) => {
    let lines = txt.split(/\r*\n/)
        .filter(l => l != "")
        .map(l => l.split(dem))

    let header = lines.shift()
        .map(l =>
            l.toLowerCase()
                .replace(/\s|\./g, '_')
        )

    console.log(header)
    // console.log(lines)

    if (!header?.length || !lines[0]?.length) {
        throw Error("加载故障！")
    }
    const ll = lines[0].length;

    if (header.length - ll == 1) {
        header.unshift("index")
    } else if (header.length - ll > 1) {
        throw Error("列名缺失！")
    }

    if (!header.includes('accession_id'))
        throw Error("accession_id字段缺失！")

    const columnSet = new Set(
        gnenTitle
            .filter(i => i.name != "action")
            .map(i => i.name)
    )

    const data = lines.map(
        (l, i) => {
            if (l.length != ll)
                throw Error(`共${ll}列，第${i}行有${l.length}列！`)

            let obj = {}
            l.forEach((ele, idx) => {
                if (!columnSet.has(header[idx])) return
                if (ele === "NA") {
                    obj[header[idx]] = null
                } else {
                    const nele = Number(ele)
                    obj[header[idx]] = isNaN(nele) ? ele : nele
                }
            })
            // obj['idx'] = i
            return obj
        }
    )

    return { header, data }
}

export const txtToJson = (filePath, encode = 'utf-8') => {
    return new Promise((resolve, reject) => {
        try {
            let fileReader = new FileReader();
            fileReader.onload = function () {
                const data = transformer(
                    this.result,
                    filePath.name.endsWith(".tsv") ? '\t' : ','
                )
                resolve(data)
            }
            fileReader.readAsText(filePath, encode)
        } catch (e) {
            reject(e)
        }
    });
}
