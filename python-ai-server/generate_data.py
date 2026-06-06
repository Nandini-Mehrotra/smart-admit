import csv
import random

def generate_hierarchical_dataset():
    streams = ['Engineering', 'Business', 'Arts', 'Science', 'Design']
    skills_pool = ['React;Node', 'Python;MachineLearning', 'Excel;Finance', 'C++;Algorithms', 'Writing;Research', 'Java;Spring']
    
    # The Hierarchical Mapping Dictionary
    locations = {
        'India': ['Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Delhi'],
        'USA': ['California', 'New York', 'Texas', 'Massachusetts'],
        'Canada': ['Ontario', 'British Columbia', 'Quebec'],
        'UK': ['England', 'Scotland'],
        'Australia': ['New South Wales', 'Victoria']
    }

    with open('students_records.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        
        # New Header with both Country and State
        writer.writerow(['name', 'stream', 'skills', 'internships', 'majorProjects', 'targetCountry', 'targetState', 'maxBudget_USD', 'admissionStatus'])
        
        for i in range(500):
            name = f"Applicant_{i+1}"
            stream = random.choice(streams)
            skills = random.choice(skills_pool)
            internships = random.randint(0, 4)
            projects = random.randint(0, 5)
            
            # 1. Pick a random country
            country = random.choice(list(locations.keys()))
            # 2. Pick a random state specifically from that country's list
            state = random.choice(locations[country])
            
            budget = random.randint(10000, 100000)
            
            score = (internships * 2) + projects + (budget / 20000)
            status = 1 if score > 7 else 0
            
            writer.writerow([name, stream, skills, internships, projects, country, state, budget, status])

    print("🌍 Successfully generated 200 global records with Country and State mapping!")

if __name__ == '__main__':
    generate_hierarchical_dataset()