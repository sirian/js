export class BaseEvent {
    private _propagationStopped = false;

    public isPropagationStopped() {
        return this._propagationStopped;
    }

    public stopPropagation() {
        this._propagationStopped = true;
    }
}
