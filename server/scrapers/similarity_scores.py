# generate i.) cosine similarity, ii.) Jaccard similarity, iii.) minimum edit distance, and iv.) simple similarity.

import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity, cosine_distances, haversine_distances, euclidean_distances

def cosine_similarity_score(a: str, b: str) -> float:
    # Convert a collection of text documents to a matrix of token counts
    count_vectorizer = CountVectorizer(stop_words='english')
    count_matrix = count_vectorizer.fit_transform([a, b])

    # Compute cosine similarity between samples in X and Y
    return cosine_similarity(count_matrix)[0][1]

def cosine_distance_score(a: str, b: str) -> float:
    # Convert a collection of text documents to a matrix of token counts
    count_vectorizer = CountVectorizer(stop_words='english')
    count_matrix = count_vectorizer.fit_transform([a, b])

    # Compute cosine similarity between samples in X and Y
    return 1 - cosine_distances(count_matrix)[0][1]

def jaccard_similarity_score(a: str, b: str) -> float:
    # split the string into words
    list1 = [s.strip().lower() for s in a.split()]
    list2 = [s.strip().lower() for s in b.split()]

    intersection = len(list(set(list1).intersection(list2)))
    union = (len(set(list1)) + len(set(list2))) - intersection
    return float(intersection) / union

# too slow
# def levenshtein_distance(str1, str2):
#     print('levenshtein_distance')
#     m, n = len(str1), len(str2)
#     dp = [[0] * (n + 1) for _ in range(m + 1)]

#     for i in range(m + 1):
#         for j in range(n + 1):
#             if i == 0:
#                 dp[i][j] = j
#             elif j == 0:
#                 dp[i][j] = i
#             elif str1[i - 1] == str2[j - 1]:
#                 dp[i][j] = dp[i - 1][j - 1]
#             else:
#                 dp[i][j] = 1 + min(dp[i - 1][j],      # Insertion
#                                     dp[i][j - 1],      # Deletion
#                                     dp[i - 1][j - 1])  # Substitution

#     return dp[m][n]

# def sim_min_edit_score(a: str, b: str) -> float:
#     print('sim_min_edit_score')
#     # split the string into words
#     list1 = [s.strip().lower() for s in a.split()]
#     list2 = [s.strip().lower() for s in b.split()]

#     # compute the edit distance between the two strings
#     return 1 - levenshtein_distance(list1, list2) / max(len(list1), len(list2))

if __name__ == '__main__':
    print(cosine_similarity_score("apple banana pear orange", "apple banana pear orange orange"))
    print(jaccard_similarity_score("apple banana pear orange", "apple banana pear orange strawberry"))
    print(cosine_distance_score("apple banana pear orange", "apple banana pear orange strawberry bear"))