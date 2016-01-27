/**
 * Created by Lukas on 26-01-2016.
 */

function StadsDataHandler() {}

StadsDataHandler.login = function(username, password) {
    $.post("/MyAU/API/stadsdata.php",
        {
            username: username,
            password: password
        },
        function (data, status) {
            StadsDataHandler.stadsData = data;
            if (typeof StadsDataHandler.loggedIn !== 'undefined') {
                StadsDataHandler.loggedIn();
            }
        });
};

StadsDataHandler.bindToForm = function(form) {
    $(form).submit(function (e) {
        e.preventDefault();
        var form = this;
        StadsDataHandler.login($(form).find("input[name=username]").val(), $(form).find("input[name=password]").val());
        return false;
    })
};

StadsDataHandler.fillGradeTable = function(table) {
    var gradeTableBody = $(table);
    gradeTableBody.empty();
    for (var i = 0; i < StadsDataHandler.stadsData.grades.length; i++) {
        var tr = document.createElement("tr");
        var courseTd = document.createElement("td");
        var gradeTd = document.createElement("td");
        var ectsTd = document.createElement("td");
        gradeTableBody.append(tr);
        tr.appendChild(courseTd);
        tr.appendChild(gradeTd);
        tr.appendChild(ectsTd);

        courseTd.textContent = StadsDataHandler.stadsData.grades[i].courseName;
        gradeTd.textContent = StadsDataHandler.stadsData.grades[i].grade;
        ectsTd.textContent = StadsDataHandler.stadsData.grades[i].ects;
    }
};

StadsDataHandler.fillMeritTable = function(table) {
    var gradeTableBody = $(table);
    gradeTableBody.empty();
    for (var i = 0; i < StadsDataHandler.stadsData.merits.length; i++) {
        var tr = document.createElement("tr");
        var courseTd = document.createElement("td");
        var gradeTd = document.createElement("td");
        var ectsTd = document.createElement("td");
        gradeTableBody.append(tr);
        tr.appendChild(courseTd);
        tr.appendChild(gradeTd);
        tr.appendChild(ectsTd);

        courseTd.textContent = StadsDataHandler.stadsData.merits[i].courseName;
        gradeTd.textContent = StadsDataHandler.stadsData.merits[i].grade;
        ectsTd.textContent = StadsDataHandler.stadsData.merits[i].ects;
    }
};

StadsDataHandler.getGradeDistribution = function() {
    var gradeDistribution = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < StadsDataHandler.stadsData.grades.length; i++) {
        gradeDistribution[GradeToIndex(StadsDataHandler.stadsData.grades[i].grade)]++;
    }
    for (i = 0; i < StadsDataHandler.stadsData.merits.length; i++) {
        gradeDistribution[GradeToIndex(StadsDataHandler.stadsData.merits[i].grade)]++;
    }
    return gradeDistribution;
};

StadsDataHandler.getAverageProgression = function() {
    var gradeData = StadsDataHandler.getAllPassedGradesSorted();
    var output = [];
    var total = 0;
    var ignored = 0;
    for(var i = 0; i < gradeData.length; i++) {
        var grade = gradeData[i];
        total += Number(grade.grade);
        output.push(total / ((i+1) - ignored));
    }
    return output;
};

StadsDataHandler.getAllPassedGradesSorted = function () {
    var gradeData = StadsDataHandler.stadsData.grades.concat(StadsDataHandler.stadsData.merits);
    gradeData.sort(SortByRatedAt);
    return gradeData.filter(function (grade) {
        var gradeNum = Number(grade.grade);
        return !isNaN(gradeNum) && gradeNum > 0;
    });
};

function SortByRatedAt(a, b) {
    var aDate = new Date(a.ratedAt);
    var bDate = new Date(b.ratedAt);
    return aDate - bDate;
};

function GradeToIndex(grade) {
    switch (grade) {
        case "-3":
            return 0;
        case "00":
            return 1;
        case "02":
            return 2;
        case "4":
            return 3;
        case "7":
            return 4;
        case "10":
            return 5;
        case "12":
            return 6;
        default:
            return -1;
    }
}

function IndexToGrade(index) {
    switch (index) {
        case 0:
            return -3;
        case 1:
            return 0;
        case 2:
            return 2;
        case 3:
            return 4;
        case 4:
            return 7;
        case 5:
            return 10;
        case 6:
            return 12;
        default:
            return null;
    }
}