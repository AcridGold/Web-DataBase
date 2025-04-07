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

void add_record(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked);
void print_all();
void find_by_name(const char* name);
void delete_by_passengerId(const char* passengerId);

EMSCRIPTEN_KEEPALIVE
void add_record_js(const char* passengerId, int survived, int pclass, const char* name, const char* sex, float age,
                   int sibSp, int parch, const char* ticket, float fare, const char* cabin, const char* embarked);

EMSCRIPTEN_KEEPALIVE
void print_all_js();

EMSCRIPTEN_KEEPALIVE
void find_by_name_js(const char* name);

EMSCRIPTEN_KEEPALIVE
void delete_by_passengerId_js(const char* passengerId);

#endif