let result_df_sorted = [];

function proses() {
  const outputDiv = document.getElementById("output");
  const errorDiv = document.getElementById("error");
  const jsonInput = document.getElementById("jsonInput");

  try {
    const jsonData = jsonInput.value.trim();

    if (!jsonData) {
      errorDiv.textContent = "Masukkan data JSON terlebih dahulu.";
      return;
    }

    const data = JSON.parse(jsonData);
    const df = data.result.reportItem;

    // Menghindari data duplikat berdasarkan "keyword"
    const uniqueKeywords = new Set(
      result_df_sorted.map((item) => item.keyword)
    );
    const newData = df.filter((item) => !uniqueKeywords.has(item.keyword));
    result_df_sorted = [...result_df_sorted, ...newData];

    result_df_sorted.sort((a, b) => b.historicalPV - a.historicalPV);

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "mt-4");

    const headerRow = table.insertRow(0);
    const headerCellCopy = headerRow.insertCell(0);
    const headerCellKeyword = headerRow.insertCell(1);
    const headerCellPV = headerRow.insertCell(2);

    headerCellCopy.textContent = "Aksi";
    headerCellKeyword.textContent = "Kata Kunci";
    headerCellPV.textContent = "Volume Pencarian";

    result_df_sorted.forEach((row, index) => {
      const newRow = table.insertRow(index + 1);
      const cellCopy = newRow.insertCell(0);
      const cellKeyword = newRow.insertCell(1);
      const cellPV = newRow.insertCell(2);

      const copyButton = document.createElement("button");
      copyButton.textContent = "Salin";
      copyButton.classList.add("btn", "btn-light");
      copyButton.onclick = function () {
        salinNilai(row.keyword);
      };

      cellCopy.appendChild(copyButton);

      const link = document.createElement("a");
      link.href = generateLink(row.keyword);
      link.target = "_blank";
      link.textContent = row.keyword;
      link.style.cursor = "pointer";
      link.onclick = function () {
        window.open(this.href, "_blank");
        return false;
      };

      cellKeyword.appendChild(link);
      cellPV.textContent = row.historicalPV;
    });

    outputDiv.textContent = "";
    errorDiv.textContent = "";
    outputDiv.appendChild(table);

    jsonInput.value = "";
  } catch (error) {
    outputDiv.textContent = "";
    errorDiv.textContent = `Gagal memproses data. Periksa kembali format penulisan JSON: ${error.message}`;
  }
}

function salinNilai(keyword) {
  const tempInput = document.createElement("input");
  tempInput.value = keyword;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function generateLink(keyword) {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://www.lazada.co.id/catalog/?q=${encodedKeyword}`;
}

function simpan() {
  const outputDiv = document.getElementById("output");
  const errorDiv = document.getElementById("error");

  if (result_df_sorted.length === 0) {
    errorDiv.textContent = "Belum ada data untuk disimpan.";
    return;
  }

  try {
    const uniqueData = Array.from(
      new Set(result_df_sorted.map((item) => JSON.stringify(item)))
    ).map((item) => JSON.parse(item));

    const csvContent = uniqueData
      .map((row) => `${row.keyword},${row.historicalPV}`)
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.classList.add("btn", "btn-success", "mt-4", "mb-4", "d-block");
    a.textContent = "Klik di sini untuk mengunduh file CSV";
    outputDiv.textContent = "";
    errorDiv.textContent = "";
    outputDiv.appendChild(a);
  } catch (error) {
    outputDiv.textContent = "";
    errorDiv.textContent = `Gagal menyimpan data. Terjadi kesalahan: ${error.message}`;
  }
}

function reset() {
  const outputDiv = document.getElementById("output");
  outputDiv.textContent = "";
  result_df_sorted = [];
}
