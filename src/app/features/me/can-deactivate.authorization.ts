import {CanDeactivateFn} from '@angular/router';
import MeDraft from './draft/draft';

export const confirmExitGuard: CanDeactivateFn<MeDraft> = (component): boolean => {
    if (component.form.dirty) {
        return confirm("Êtes-vous sûr de vouloir quitter l'édition ?");
    }
    return true
}
