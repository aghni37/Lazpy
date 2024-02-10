import pandas as pd
import json

def process_data(df):
    # Fungsi atau proses yang ingin Anda jalankan setelah memasukkan data JSON
    # Misalnya, menampilkan jumlah total historicalPV
    total_historicalPV = df['historicalPV'].sum()
    print(f"Total Historical PV: {total_historicalPV}")

# Inisialisasi dataframe kosong
result_df_sorted = pd.DataFrame()

while True:
    try:
        # Minta pengguna untuk memasukkan data JSON atau perintah lain
        user_input = input("\033[93m\033[1mMasukkan data JSON, ketik 'proses' untuk menampilkan hasil seleksi, 'simpan' untuk menyimpan ke CSV, 'keluar' untuk keluar: \033[0m").strip()

        if user_input.lower() == 'keluar':
            break
        elif user_input.lower() == 'proses':
            if not result_df_sorted.empty:
                # Menghapus duplikat berdasarkan kolom "historicalPV"
                result_df_sorted = result_df_sorted.drop_duplicates(subset=['historicalPV'])

                # Menampilkan hasil seleksi dengan warna
                print("\033[92m" + "Hasil seleksi:" + "\033[0m")  # Warna hijau untuk "Hasil seleksi"
                for index, row in result_df_sorted.iterrows():
                    print("\033[92m" + f"kata kunci: {row['keyword']}" + "\033[0m")  # Warna hijau untuk keyword
                    print("\033[94m" + f"Volume pencarian: {row['historicalPV']}" + "\033[0m")  # Warna biru untuk historicalPV
                    print()
            else:
                print("Belum ada data untuk diproses.")
        elif user_input.lower() == 'simpan':
            if not result_df_sorted.empty:
                # Meminta nama file dari pengguna
                filename = input("Masukkan nama file CSV untuk menyimpan data: ")

                # Menghapus duplikat berdasarkan kolom "historicalPV" sebelum menyimpan
                result_df_sorted = result_df_sorted.drop_duplicates(subset=['historicalPV'])

                # Menyimpan dataframe ke file CSV
                result_df_sorted.to_csv(filename, index=False)
                print(f"Data telah disimpan ke file {filename}")
            else:
                print("Belum ada data untuk disimpan.")
        else:
            # Mengubah string JSON menjadi objek Python
            data = json.loads(user_input)

            # Membuat dataframe dari data
            df = pd.DataFrame(data['result']['reportItem'])

            # Memilih kolom "keyword" dan "historicalPV"
            selected_columns = ['keyword', 'historicalPV']

            # Menghapus duplikat berdasarkan kolom "historicalPV" sebelum menambahkan ke dataframe utama
            df = df[selected_columns].drop_duplicates(subset=['historicalPV'])

            # Menggabungkan dataframe hasil sebelumnya dengan dataframe baru
            result_df_sorted = pd.concat([result_df_sorted, df], ignore_index=True)

            # Mengurutkan dataframe berdasarkan kolom "historicalPV" dari yang terbesar ke terkecil
            result_df_sorted = result_df_sorted.sort_values(by='historicalPV', ascending=False)

    except json.JSONDecodeError:
        print("\033[91m\033[1mGagal memproses data, periksa kembali format penulisan JSON.\033[0m")
    except KeyError:
        print("\033[91m\033[1mData JSON tidak sesuai dengan format yang diharapkan.\033[0m")
    except Exception as e:
        print("\033[91m\033[1mTerjadi kesalahan:", e, "\033[0m")
