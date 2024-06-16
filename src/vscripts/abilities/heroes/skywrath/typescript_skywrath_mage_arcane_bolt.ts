// new custom ability 

import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

// declare the ability's class
// add properties + method
@registerAbility()
export class typescript_skywrath_mage_arcane_bolt extends BaseAbility
{
    sound_cast: string = "Hero_SkywrathMage.ArcaneBolt.Cast";
    sound_impact: string = "Hero_SkywrathMage.ArcaneBolt.Impact";
    projectile_arcane_bolt: string = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf";

    OnSpellStart(): void {
        const target = this.GetCursorTarget();
        const bolt_speed = this.GetSpecialValueFor("bolt_speed");
        const bolt_vision = this.GetSpecialValueFor("bolt_vision");

        ProjectileManager.CreateTrackingProjectile(
            {
                Ability: this,
                EffectName: this.projectile_arcane_bolt,
                Source: this.GetCaster(),
                Target: target,
                bDodgeable: false,
                bProvidesVision: true,
                iMoveSpeed: bolt_speed,
                iVisionRadius: bolt_vision,
                iVisionTeamNumber: this.GetCaster().GetTeamNumber()
            })          
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector)
    {
        if (!target) return;

        EmitSoundOn(this.sound_impact, target);

        const bolt_vision = this.GetSpecialValueFor("bolt_vision");
        const bolt_damage = this.GetSpecialValueFor("bolt_damage");
        const int_multiplier = this.GetSpecialValueFor("int_multiplier");
        const vision_duration = this.GetSpecialValueFor("vision_duration");

        AddFOWViewer(this.GetCaster().GetTeamNumber(), location, bolt_vision, vision_duration, false);

        // custom formula damage => but doesn't work properly with method GetIntellect()

        /*let damage = bolt_damage;
        if (this.GetCaster().IsHero())
        {
            damage += (this.GetCaster() as CDOTA_BaseNPC_Hero).GetIntellect(true) * int_multiplier;
            damage += 1000 * int_multiplier;
        }*/

        ApplyDamage(
            {
                attacker: this.GetCaster(),
                damage: bolt_damage,
                damage_type: DamageTypes.MAGICAL,
                victim: target,
                ability: this,      
                damage_flags: DamageFlag.NONE
            }
        );
    }
}