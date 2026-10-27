import os


def generateCnfFile():
    path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    keyWords = {}

    keyWords["database"] = input("Enter name dabatase: ")
    keyWords["user"] = input("Enter user dabatase: ")
    keyWords["password"] = input("Enter password dabatase: ")
    keyWords["host"] = input("Enter host [default: localhost]: ")
    keyWords["port"] = input("Enter port [default: 3306]: ")

    if keyWords["host"] == "":
        keyWords["host"] = "localhost"

    if keyWords["port"] == "":
        keyWords["port"] = "3306"

    with open(f"{path}/my.cnf", "w") as f:
        f.write("[client]\n")
        for key, value in keyWords.items():
            f.write(f"{key}={value}\n")
    print(f"Done, file created in {os.path.join(path, 'my.cnf')}")


if __name__ == "__main__":
    generateCnfFile()
