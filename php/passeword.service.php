<?php
/**
 * Service de hachage et vérification des mots de passe.
 * Utilise bcrypt via password_hash() / password_verify().
 */
class PasswordService
{
    public function hasher(string $motDePasse): string
    {
        return password_hash($motDePasse, PASSWORD_BCRYPT);
    }

    public function verifier(string $motDePasse, string $empreinte): bool
    {
        return password_verify($motDePasse, $empreinte);
    }
}
