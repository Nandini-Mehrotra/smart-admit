import pandas as pd

def clean_data(file_path):
    try:
        df = pd.read_csv(file_path)
        print("Raw Data Loaded Successfully")

        clean_df = df.dropna() #removes the rows which have missing entries
        
        print(f"Data Cleaned: {len(clean_df)} valid applicant records ready for training.")
        return clean_df

    except Exception as e:
        print(f"Error cleaning data: {e}")
        return None

if __name__ == '__main__':
    clean_data('students_records.csv')