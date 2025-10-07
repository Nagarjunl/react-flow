const string RulesJson = [
{
"WorkflowName": "CommissionWorkflow",
"Rules": [
{
"RuleName": "Calculate_MonthlyTarget_Junior",
"Expression": "user.Position == \"Junior\" AND context.SumOfOthersWorkingHours > 0",
"Actions": {
"OnSuccess": {
"Name": "OutputExpression",
"Context": {
"Expression": "context.OverallSalesTarget * (attendance.WorkingHours / context.SumOfOthersWorkingHours)"
}
}
},
"SuccessEvent": "IndividualTarget"
},
{
"RuleName": "Calculate_MonthlyTarget_Trainee",
"Expression": "user.Position == \"Trainee\" AND context.SumOfOthersWorkingHours > 0",
"Actions": {
"OnSuccess": {
"Name": "OutputExpression",
"Context": {
"Expression": "context.OverallSalesTarget * (attendance.WorkingHours / context.SumOfOthersWorkingHours)"
}
}
},
"SuccessEvent": "IndividualTarget"
},
{
"RuleName": "Calculate_MonthlyTarget_Senior",
"Expression": "user.Position == \"Senior\" AND context.SumOfOthersWorkingHours > 0",
"Actions": {
"OnSuccess": {
"Name": "OutputExpression",
"Context": {
"Expression": "(context.OverallSalesTarget * (attendance.WorkingHours / context.SumOfOthersWorkingHours)) / 2"
}
}
},
"SuccessEvent": "IndividualTarget"
}
]
}
];

// ==================================================

{
"WorkflowName": "inputWorkflow",

    "Rules": [
      {
        "RuleName": "GiveDiscount20Percent",
        "Expression": "input1.couy == \"india\" AND input1.loyalityFactor <= 5 AND input1.totalPurchasesToDate >= 20000",
        "Actions": {
          "OnSuccess": {
            "Name": "OutputExpression",  //Name of action you want to call
            "Context": {  //This is passed to the action as action context
              "Expression": "input1.TotalBilled * 0.8"
            }
          },
          "OnFailure": { // This will execute if the Rule evaluates to failure
            "Name": "EvaluateRule",
            "Context": {
              "workflowName": "inputWorkflow",
              "ruleName": "GiveDiscount10Percent"
            }
          }
        }
      },
      {
        "RuleName": "GiveDiscount10Percent",
        "SuccessEvent": "10",
        "ErrorMessage": "One or more adjust rules failed.",
        "ErrorType": "Error",
        "RuleExpressionType": "LambdaExpression",
        "Expression": "input1.couy == \"india\" AND input1.loyalityFactor <= 2 AND input1.totalPurchasesToDate >= 5000 AND input2.totalOrders > 2 AND input2.noOfVisitsPerMonth > 2",
        "Actions": {
          "OnSuccess": {
            "Name": "OutputExpression",  //Name of action you want to call
            "Context": {  //This is passed to the action as action context
              "Expression": "input1.TotalBilled * 0.9"
            }
          }
        }
      }
    ]

}
