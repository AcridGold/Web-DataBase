#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

typedef struct {
    char passengerId[10];
    int survived;
    int pclass;
    char name[100];
    char sex[10];
    float age;
    int sibSp;
    int parch;
    char ticket[20];
    float fare;
    char cabin[20];
    char embarked[5];
} Record;

typedef struct Node {
    Record data;
    struct Node* next;
} Node;

Node* head = NULL;

void add_record(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
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
    strncpy(new_node->data.cabin, cabin[0] ? cabin : "null", 20); // Обработка null
    strncpy(new_node->data.embarked, embarked, 5);
    new_node->next = head;
    head = new_node;
}

void print_all() {
    Node* current = head;
    while (current != NULL) {
        printf("{\"PassengerId\":\"%s\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%s\",\"Sex\":\"%s\",\"Age\":%.1f,\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%s\",\"Fare\":%.2f,\"Cabin\":\"%s\",\"Embarked\":\"%s\"}\n",
               current->data.passengerId, current->data.survived, current->data.pclass, current->data.name,
               current->data.sex, current->data.age, current->data.sibSp, current->data.parch, current->data.ticket,
               current->data.fare, current->data.cabin, current->data.embarked);
        current = current->next;
    }
}

void find_by_name(const char* name) {
    Node* current = head;
    while (current != NULL) {
        if (strstr(current->data.name, name) != NULL) {
            printf("{\"PassengerId\":\"%s\",\"Survived\":\"%d\",\"Pclass\":\"%d\",\"Name\":\"%s\",\"Sex\":\"%s\",\"Age\":%.1f,\"SibSp\":\"%d\",\"Parch\":\"%d\",\"Ticket\":\"%s\",\"Fare\":%.2f,\"Cabin\":\"%s\",\"Embarked\":\"%s\"}\n",
                   current->data.passengerId, current->data.survived, current->data.pclass, current->data.name,
                   current->data.sex, current->data.age, current->data.sibSp, current->data.parch, current->data.ticket,
                   current->data.fare, current->data.cabin, current->data.embarked);
        }
        current = current->next;
    }
}

void delete_by_passengerId(const char* passengerId) {
    Node *current = head, *prev = NULL;
    while (current != NULL && strcmp(current->data.passengerId, passengerId) != 0) {
        prev = current;
        current = current->next;
    }
    if (current == NULL) return;
    if (prev == NULL) head = current->next;
    else prev->next = current->next;
    free(current);
}

// Экспорт функций
EMSCRIPTEN_KEEPALIVE
void add_record_js(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                   int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked) {
    add_record(passengerId, survived, pclass, name, sex, age, sibSp, parch, ticket, fare, cabin, embarked);
}

EMSCRIPTEN_KEEPALIVE
void print_all_js() {
    print_all();
}

EMSCRIPTEN_KEEPALIVE
void find_by_name_js(const char* name) {
    find_by_name(name);
}

EMSCRIPTEN_KEEPALIVE
void delete_by_passengerId_js(const char* passengerId) {
    delete_by_passengerId(passengerId);
}