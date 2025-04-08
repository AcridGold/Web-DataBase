#ifndef NOTEBOOK_H
#define NOTEBOOK_H

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

Node* create_list();
void add_record(Node** head, const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked);
void print_all(Node* head);
void find_by_name(Node* head, const char* name);
void delete_by_passengerId(Node** head, const char* passengerId);
void free_list(Node** head);

void load_from_json(Node** head, const char* json_data);
char* save_to_json(Node* head);

EMSCRIPTEN_KEEPALIVE
void add_record_js(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                   int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked);

EMSCRIPTEN_KEEPALIVE
void print_all_js();

EMSCRIPTEN_KEEPALIVE
void find_by_name_js(const char* name);

EMSCRIPTEN_KEEPALIVE
void delete_by_passengerId_js(const char* passengerId);

EMSCRIPTEN_KEEPALIVE
void load_from_json_js(const char* json_data);

EMSCRIPTEN_KEEPALIVE
char* save_to_json_js();

#endif