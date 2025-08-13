'''
    Simple script to analyze the sample text data and determine correlations
'''

import pandas as pd

def calculate_correlations():
    """
    Reads the CSV file, calculates the specified correlations, and prints them to the console.
    """
    try:
        # Load the CSV file into a pandas DataFrame
        df = pd.read_csv('sampleTextTest.csv')
        
        # Word Count vs. NLI Score
        corr_wc_nli = df['WordCount'].corr(df['NLI_Score'])
        print(f"Correlation between Word Count and NLI Score: {corr_wc_nli:.3f}")
        
        # Word Count vs. Flesch-Kincaid Score
        corr_wc_flesch = df['WordCount'].corr(df['FleschKincaid'])
        print(f"Correlation between Word Count and Flesch-Kincaid Score: {corr_wc_flesch:.3f}")

        # Word Count vs. Word Frequency Score
        corr_wc_wordfreq = df['WordCount'].corr(df['WordFrequencyScore'])
        print(f"Correlation between Word Count and Word Frequency Score: {corr_wc_wordfreq:.3f}")

        # NLI Score vs. Word Frequency Score
        corr_nli_wordfreq = df['NLI_Score'].corr(df['WordFrequencyScore'])
        print(f"Correlation between NLI Score and Word Frequency Score: {corr_nli_wordfreq:.3f}")

        # NLI Score vs. Flesch-Kincaid Score
        corr_nli_flesch = df['NLI_Score'].corr(df['FleschKincaid'])
        print(f"Correlation between NLI Score and Flesch-Kincaid Score: {corr_nli_flesch:.3f}")
        
    except FileNotFoundError:
        print("Error: 'sampleTextTest.csv' not found.")
        print("Please ensure you have run your TypeScript script to generate the file.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    calculate_correlations()
