#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "notebook.h"

static Node* list = NULL;

Node* create_list() {
    return NULL;
}

void add_record(Node** head, const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    strncpy(new_node->data.passengerId, passengerId, 10);
    new_node->data.survived = survived;
    new_node->data.pclass = pclass;
    strncpy(new_node->data.name, name, 100);
    strncpy(new_node->data.sex, sex, 10);
    new_node->data.age = age;
    new_node->data.sibSp = sibSp;
    new_node->data.parch = parch;
    strncpy(new_node->data.ticket, ticket, 20);
    new_node->data.fare = fare;
    strncpy(new_node->data.cabin, cabin[0] ? cabin : "", 20);
    strncpy(new_node->data.embarked, embarked, 5);
    new_node->next = *head;
    *head = new_node;
}

void print_all(Node* head) {
    Node* current = head;
    while (current != NULL) {
        char age_str[10];
        if (current->data.age == -1.0) {
            strcpy(age_str, "null");
        } else {
            snprintf(age_str, 10, "%.1f", current->data.age);
        }
        char cabin_str[20];
        strcpy(cabin_str, current->data.cabin[0] ? current->data.cabin : "null");
        printf("{\"PassengerId\":\"%s\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%s\",\"Sex\":\"%s\",\"Age\":%s,\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%s\",\"Fare\":%.2f,\"Cabin\":\"%s\",\"Embarked\":\"%s\"}\n",
               current->data.passengerId, current->data.survived, current->data.pclass, current->data.name,
               current->data.sex, age_str, current->data.sibSp, current->data.parch, current->data.ticket,
               current->data.fare, cabin_str, current->data.embarked);
        current = current->next;
    }
}

void find_by_name(Node* head, const char* name) {
    Node* current = head;
    while (current != NULL) {
        if (strstr(current->data.name, name) != NULL) {
            char age_str[10];
            if (current->data.age == -1.0) {
                strcpy(age_str, "null");
            } else {
                snprintf(age_str, 10, "%.1f", current->data.age);
            }
            char cabin_str[20];
            strcpy(cabin_str, current->data.cabin[0] ? current->data.cabin : "null");
            printf("{\"PassengerId\":\"%s\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%s\",\"Sex\":\"%s\",\"Age\":%s,\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%s\",\"Fare\":%.2f,\"Cabin\":\"%s\",\"Embarked\":\"%s\"}\n",
                   current->data.passengerId, current->data.survived, current->data.pclass, current->data.name,
                   current->data.sex, age_str, current->data.sibSp, current->data.parch, current->data.ticket,
                   current->data.fare, cabin_str, current->data.embarked);
        }
        current = current->next;
    }
}

void delete_by_passengerId(Node** head, const char* passengerId) {
    Node *current = *head, *prev = NULL;
    while (current != NULL && strcmp(current->data.passengerId, passengerId) != 0) {
        prev = current;
        current = current->next;
    }
    if (current == NULL) return;
    if (prev == NULL) *head = current->next;
    else prev->next = current->next;
    free(current);
}

void free_list(Node** head) {
    Node* current = *head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
    *head = NULL;
}

void load_from_json(Node** head, const char* json_data) {
    free_list(head);
    char* data = strdup(json_data);
    char* token = strtok(data, "\n");
    while (token != NULL) {
        char passengerId[10], name[100], sex[10], ticket[20], cabin[20], embarked[5];
        int survived, pclass, sibSp, parch;
        float age, fare;
        char age_str[10], cabin_str[20];
        sscanf(token, "{\"PassengerId\":\"%[^\"]\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%[^\"]\",\"Sex\":\"%[^\"]\",\"Age\":%[^,],\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%[^\"]\",\"Fare\":%f,\"Cabin\":%[^,],\"Embarked\":\"%[^\"]\"}",
               passengerId, &survived, &pclass, name, sex, age_str, &sibSp, &parch, ticket, &fare, cabin_str, embarked);
        age = (strcmp(age_str, "null") == 0) ? -1.0 : atof(age_str);
        if (strcmp(cabin_str, "null") == 0) cabin[0] = '\0';
        else strncpy(cabin, cabin_str + 1, strlen(cabin_str) - 2); // Убираем кавычки
        add_record(head, passengerId, survived, pclass, name, sex, age, sibSp, parch, ticket, fare, cabin, embarked);
        token = strtok(NULL, "\n");
    }
    free(data);
}

char* save_to_json(Node* head) {
    static char buffer[4096] = {0};
    buffer[0] = '\0';
    Node* current = head;
    while (current != NULL) {
        char entry[512];
        char age_str[10];
        if (current->data.age == -1.0) {
            strcpy(age_str, "null");
        } else {
            snprintf(age_str, 10, "%.1f", current->data.age);
        }
        char cabin_str[20];
        strcpy(cabin_str, current->data.cabin[0] ? current->data.cabin : "null");
        snprintf(entry, 512, "{\"PassengerId\":\"%s\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%s\",\"Sex\":\"%s\",\"Age\":%s,\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%s\",\"Fare\":%.2f,\"Cabin\":\"%s\",\"Embarked\":\"%s\"}\n",
                 current->data.passengerId, current->data.survived, current->data.pclass, current->data.name,
                 current->data.sex, age_str, current->data.sibSp, current->data.parch, current->data.ticket,
                 current->data.fare, cabin_str, current->data.embarked);
        strncat(buffer, entry, 4096 - strlen(buffer) - 1);
        current = current->next;
    }
    return buffer;
}

void add_record_js(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                   int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked) {
    add_record(&list, passengerId, survived, pclass, name, sex, age, sibSp, parch, ticket, fare, cabin, embarked);
}

void print_all_js() {
    print_all(list);
}

void find_by_name_js(const char* name) {
    find_by_name(list, name);
}

void delete_by_passengerId_js(const char* passengerId) {
    delete_by_passengerId(&list, passengerId);
}

void load_from_json_js(const char* json_data) {
    load_from_json(&list, json_data);
}

char* save_to_json_js() {
    return save_to_json(list);
}