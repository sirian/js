export interface IExpressionFunction {
    compile(...args: any[]): any;

    evaluate(...args: any[]): any;
}
