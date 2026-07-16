from rest_framework import serializers
from .models import CustomUser, Role, Team, TeamMember

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    # Allow Angular to send role="Admin" as a string, and map it back to the Role object
    role = serializers.SlugRelatedField(
        queryset=Role.objects.all(),
        slug_field='name',
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'firstName', 'lastName', 'role', 'status', 'password', 
            'profileImage', 'bio', 'age', 'account_balance', 'birth_date', 'website'
        ]
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role']

class TeamSerializer(serializers.ModelSerializer):
    # This maps directly to the Angular FormArray!
    members = TeamMemberSerializer(many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_at']

    def create(self, validated_data):
        # 1. Pop the array of members out of the validated data
        members_data = validated_data.pop('members')
        
        # 2. Create the parent Team object
        team = Team.objects.create(**validated_data)
        
        # 3. Loop through the array and create a TeamMember for each one, linking it to the parent
        for member_data in members_data:
            TeamMember.objects.create(team=team, **member_data)
            
        return team

