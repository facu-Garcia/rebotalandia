import os
from tkinter import Tk
from tkinter.filedialog import askdirectory
from math import log


# Función para convertir bytes a un tamaño legible
def convert_size(size_bytes):
    if size_bytes == 0:
        return "0 Bytes"
    size_name = ("Bytes", "KB", "MB", "GB", "TB")
    i = int(log(size_bytes, 1024))
    p = 1024 ** i
    size = round(size_bytes / p, 2)
    return f"{size} {size_name[i]}"

# Oculta la ventana principal de tkinter
Tk().withdraw()

# Abre un cuadro de diálogo para seleccionar una carpeta
folder_path = askdirectory(title="Selecciona una carpeta")

# Verifica si se seleccionó una carpeta
if folder_path:
    print(f"Archivos en la carpeta: {folder_path}\n")
    
    # Itera a través de los archivos en la carpeta
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        # Verifica si es un archivo y obtiene su tamaño
        if os.path.isfile(file_path):
            file_size = os.path.getsize(file_path)  # Tamaño en bytes
            readable_size = convert_size(file_size)  # Tamaño legible
            print(f"{filename}: {readable_size}")
else:
    print("No se seleccionó ninguna carpeta.")
